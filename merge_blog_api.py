import os

def merge_files(output_file):
    # Directory di base
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_dir = os.path.join(base_dir, 'app')
    
    # Cartelle da processare
    folders = ['api', 'blog']
    
    with open(output_file, 'w') as outfile:
        for folder in folders:
            folder_path = os.path.join(app_dir, folder)
            
            # Attraversa ricorsivamente la directory
            for root, dirs, files in os.walk(folder_path):
                for file in files:
                    # Considera solo i file TypeScript e TSX
                    if file.endswith(('.ts', '.tsx')):
                        file_path = os.path.join(root, file)
                        
                        # Crea il percorso relativo per l'output
                        rel_path = os.path.relpath(file_path, app_dir)
                        
                        # Scrivi l'intestazione con il percorso del file
                        outfile.write(f'// /app/{rel_path}\n\n')
                        
                        # Leggi e scrivi il contenuto del file
                        try:
                            with open(file_path, 'r') as infile:
                                content = infile.read()
                                outfile.write(content)
                                outfile.write('\n\n')
                        except Exception as e:
                            outfile.write(f'// Errore nella lettura del file: {str(e)}\n\n')

if __name__ == '__main__':
    output_file = 'blog-api.txt'
    merge_files(output_file)
    print(f'File uniti con successo in {output_file}')