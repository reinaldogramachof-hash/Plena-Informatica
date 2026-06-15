import os
import glob
from PIL import Image

def optimize_images(folder_path, max_size=(400, 400), quality=80):
    png_files = glob.glob(os.path.join(folder_path, '*.png'))
    if not png_files:
        print("Nenhuma imagem PNG encontrada.")
        return
        
    print(f"Encontradas {len(png_files)} imagens PNG. Iniciando otimização...")
    
    total_original_size = 0
    total_new_size = 0
    
    for png_file in png_files:
        try:
            original_size = os.path.getsize(png_file)
            total_original_size += original_size
            
            webp_file = os.path.splitext(png_file)[0] + '.webp'
            
            with Image.open(png_file) as img:
                # Convert to RGB to ensure webp compatibility if RGBA is not strictly needed, 
                # but since these are probably transparent icons, let's keep RGBA.
                # WebP supports RGBA natively.
                
                # Resize if necessary
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save as WebP
                img.save(webp_file, 'WEBP', quality=quality)
                
            new_size = os.path.getsize(webp_file)
            total_new_size += new_size
            
            print(f"Otimizado: {os.path.basename(png_file)} ({original_size/1024:.1f} KB -> {new_size/1024:.1f} KB)")
            
        except Exception as e:
            print(f"Erro ao otimizar {png_file}: {e}")
            
    print("-" * 30)
    print(f"Tamanho Original Total: {total_original_size / (1024*1024):.2f} MB")
    print(f"Tamanho Novo Total: {total_new_size / (1024*1024):.2f} MB")
    print(f"Redução: {100 - (total_new_size / total_original_size * 100):.2f}%")

if __name__ == "__main__":
    optimize_images(r"c:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena\servicos\imagens")
