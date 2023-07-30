# ! /bin/bash
DIR=$(pwd)
PROJECTDIR=$(basename $(pwd))

setup_folder="SETUP"
backup_folder="$setup_folder/BACKUP"
source_files=("README.md" "package.json" "package-lock.json")

# Variables for Azure resource group, service principal, and Terraform
terraform_working_dir="terraform-azure"
az_resource_group_name=$PROJECTDIR"_rg"
az_static_web_app_name="$PROJECTDIR"

TERRAFORM_AZURE_FOLDER="terraform-azure" 
# Check if the Terraform Azure folder exists, otherwise create it
if [ ! -d "$TERRAFORM_AZURE_FOLDER" ]; then
    echo "Terraform Azure folder does not exist. Creating..."
    mkdir -p "$TERRAFORM_AZURE_FOLDER"
fi
terraform_files=("main.tf" "outputs.tf" "variables.tf")
for file in "${terraform_files[@]}"; do
    cp "$setup_folder/$TERRAFORM_AZURE_FOLDER/$file" "$TERRAFORM_AZURE_FOLDER/$file" 
    echo "Add Github action file."
done

# Check if the backup folder exists, otherwise create it
if [ ! -d "$backup_folder" ]; then
    echo "Backup folder does not exist. Creating..."
    mkdir -p "$backup_folder"
fi

# Function to copy file to the backup folder
copy_readme_to_backup() {
    local source_file=$1
    local filename=$(basename "$source_file")
    cp "$source_file" "$backup_folder/$filename"
    echo "Copied $filename to the backup folder."
}

# Loop through the array of source files and copy each to main folder
for file in "${source_files[@]}"; do
    if [ -f "$backup_folder/$file" ]; then
        echo "$file already exists in the backup folder."
    else
        copy_readme_to_backup "$file"
    fi
done

for file in "${source_files[@]}"; do
    cp "$backup_folder/$file" "$file" 
    echo "Override $file frome backup."
done

echo "Update files with $PROJECTDIR name."
sed -i "s/starter-nextjs-tailwindcss/$PROJECTDIR/" package.json package-lock.json README.md

npm install

git add .
git commit -a -m "setup initial"
git push

# Variables for Azure resource group, service principal, and Terraform
service_principal_name=$PROJECTDIR"_sp"

# Function to log in to Azure and create a service principal
create_service_principal() {
    az login

    acc_info=$(az account list -o json)
    sub_id=$(echo "$acc_info" | jq -r '.[0].id')
    ARM_SUBSCRIPTION_ID=$sub_id
    az account set --subscription $sub_id

    echo "Creating service principal..."
    sp_info=$(az ad sp create-for-rbac --name "$service_principal_name" --role="Contributor" --scopes="/subscriptions/$sub_id" -o json)
    ARM_CLIENT_ID=$(echo "$sp_info" | jq -r '.appId')
    ARM_CLIENT_SECRET=$(echo "$sp_info" | jq -r '.password')
    ARM_TENANT_ID=$(echo "$sp_info" | jq -r '.tenant')
    echo "Service principal created for $sub_name:"
    # echo "Info $sp_info"
    # echo "ARM_CLIENT_ID=$ARM_CLIENT_ID"
    # echo "ARM_CLIENT_SECRET=$ARM_CLIENT_SECRET"
    # echo "ARM_SUBSCRIPTION_ID=$ARM_SUBSCRIPTION_ID"
    # echo "ARM_TENANT_ID=$ARM_TENANT_ID"
}

delete_service_principal() {
    sp_id_to_delete=$(az ad sp list --display-name $service_principal_name -o json | jq -r '.[0].id')
    echo "DELETE Service Principle $sp_id_to_delete"
    az ad sp delete --id $sp_id_to_delete
}

# Function to run Terraform to set up infrastructure
run_terraform() {
    echo "Running Terraform in $terraform_working_dir..."
    cd "$terraform_working_dir" || exit

    # Initialize Terraform
    terraform init

    # Plan and apply the infrastructure
    terraform plan
    terraform apply -var "resource_group_name=$az_resource_group_name" -var "static_site_name=$az_static_web_app_name" -auto-approve
}

create_service_principal
run_terraform
delete_service_principal

azswa_api_key=$(az staticwebapp secrets list --name $az_static_web_app_name --query "properties.apiKey" -o tsv) 
gh auth login -w
echo "Set up Secret API Key for Github Action deployment to Azure Static Web App"
gh secret set AZSWA_API_KEY --body $azswa_api_key

#Setup Github Actions
GITHUB_ACTIONS_FOLDER=".github/workflows" 
cd "$DIR"
# Check if the Github Actions folder exists, otherwise create it
if [ ! -d "$GITHUB_ACTIONS_FOLDER" ]; then
    echo "Github Actions folder does not exist. Creating..."
    mkdir -p "$GITHUB_ACTIONS_FOLDER"
fi

github_actions_files=("deploy_az_static_web_app.yml")
for file in "${github_actions_files[@]}"; do
    cp "$setup_folder/$GITHUB_ACTIONS_FOLDER/$file" "$GITHUB_ACTIONS_FOLDER/$file" 
    echo "Add Github action file."
done

git add .
git commit -a -m "add Github Actions"
git push