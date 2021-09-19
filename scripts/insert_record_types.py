import sqlite3

def main():
    db_name = 'archive.db'
    source_file = 'all_source_archives'

    connection = sqlite3.connect(db_name)
    cursor = connection.cursor()
    try:
        with open(source_file) as f:
            rows = [(r,) for r in f.read().split('\n')]  
            for row in rows:
                print(row)
            cursor = connection.cursor()
            cursor.executemany("INSERT INTO source_archive (name) VALUES (?)", rows)
            connection.commit()
    except FileNotFoundError:
        print(f"Couldn't open file: '{source_file}'")
    except sqlite3.OperationalError as e:
        print(e)
    except sqlite3.ProgrammingError as e:
        print(e)
    finally:
        print('Closing connection') 
        connection.close()

if __name__ == '__main__':
    main()