import sqlite3 

def get_filename(path):
  "Gets filename from path" 
  return path.split('/')[-1] 

def main():
  connection = sqlite3.connect('archive.db')
  cursor = connection.cursor() 
  cursor.execute(
  '''
  SELECT id, attachment_type_id, file_attachment
  FROM history_record 
  WHERE file_attachment != ""
  '''
  )

  
  rows = []
  for record_id, attachment_type_id, path in cursor.fetchall():
    rows.append((record_id, attachment_type_id, get_filename(path)))

  cursor.executemany(
  '''
  INSERT INTO file_attachment (record_id, attachment_type_id, file_name) 
  VALUES (?, ?, ?)
  ''', rows)
  
  connection.commit() 
  connection.close()

if __name__ == '__main__':
  main()
