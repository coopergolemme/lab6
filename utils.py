import os
import requests
import kuzu

def download_csv(url, save_path):
    print(f"Downloading {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as file:
            file.write(response.content)
            print(f"Saved {url} to {save_path}")
    else:
        print(f"Failed to download {url}. Status code: {response.status_code}")

def download_sample_data(data_dir, urls):
    print('Downloading sample data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    for url in urls:
        filename = url.split('/')[-1]
        save_path = os.path.join(data_dir, filename)
        download_csv(url, save_path)
    
    print('Sample data downloaded successfully')
    return

def setup_database(db_path, delete_existing=True):
    print('Loading graph database')
    lock_file = os.path.join(db_path, ".lock")
    # Remove existing database directory if it exists
    if delete_existing and os.path.exists(db_path):
        import shutil
        print(f"Removing existing database at {db_path}")
        shutil.rmtree(db_path)
        assert not os.path.exists(db_path), f"Failed to remove {db_path}"
    elif os.path.exists(lock_file):
        print('Removing lock file')
        try:
            os.remove(lock_file)
            print(f"Removed stale lock file: {lock_file}")
        except Exception as e:
            print(f"Warning: Failed to remove lock file: {e}")
        
    
    # Create database with new directory
    db = kuzu.Database(db_path)
    connection = kuzu.Connection(db)
    return connection