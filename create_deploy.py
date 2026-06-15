import os
import zipfile

def create_deploy_zip(zip_filename="deploy_full.zip"):
    base_dir = r"c:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena"
    
    # We remove image extensions from ignore_exts
    ignore_dirs = {'.git', '.Agent', '.claude', '.superpowers', 'Sistemas_Gestão', 'docs', 'tmp-caixa', '__pycache__'}
    ignore_exts = {'.py', '.md', '.zip', '.gitattributes', '.gitignore'}
    ignore_files = {'deploy.zip', 'deploy_full.zip', 'deploy_new.zip', 'zi1veEFl', '.gitignore', '.gitattributes'}
    
    zip_path = os.path.join(base_dir, zip_filename)
    
    if os.path.exists(zip_path):
        os.remove(zip_path)
        
    added_files = 0
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_dir):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            
            for file in files:
                if file in ignore_files:
                    continue
                
                _, ext = os.path.splitext(file)
                if ext.lower() in ignore_exts:
                    continue
                    
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, base_dir)
                
                zipf.write(file_path, arcname)
                added_files += 1
                
    print(f"Deploy zip created successfully: {zip_filename}")
    print(f"Total files added: {added_files}")

if __name__ == "__main__":
    create_deploy_zip()
