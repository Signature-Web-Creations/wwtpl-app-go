from string import Template
import sqlite3
import os
import sys


def create_update_query(set_stmt, where):
  query = '''
  UPDATE history_record
  SET $set_stmt
  WHERE $where
  '''
  template = Template(query)
  return template.substitute(query, set_stmt, value=value, where=where)


def main():
  db_connected = False
  try:
    db_name = input('What is the database name? ') 
    backup = input('What do you want to name the database backup? ')

    print('Verifying the database exists...')
    if os.path.exists(db_name):
      print('Database found')
      conn = sqlite3.connect(db_name)
      db_connected = True
      bck = sqlite3.connect(backup) 
    else:
      print(f'Database "{db_name}" not found.')
      print('Quitting program')
      sys.exit(1)

    print('Creating backup') 
    conn = sqlite3.connect(db_name)
    bck = sqlite3.connect(backup) 
    with bck:
      conn.backup(bck)
    bck.close()
    print('Successfully created the backup')
  
    field_name = input('Which field do you want to examine? ')
    update_field = input('Which field do you want to update? ')
 
    cursor = conn.cursor()
    cursor.execute(f'SELECT DISTINCT({field_name}) FROM history_record')
    for value, in cursor.fetchall():
      new_value = input(f'What do you want to set {update_field} to when {field_name} is "{value}"[Press enter to skip]? ')
      if new_value:
        where = f'WHERE {field_name}="{value}"'       
        set_stmt = f'SET {update_field}={new_value}' 
        query = f'UPDATE history_record {set_stmt} {where}'
        cursor.execute(query)
        print(query)
      else:
        print('Skipping')

    print('Commiting changes')
    conn.commit()
    print('Done.')

  except KeyboardInterrupt:
    print()
    print('Quitting program')
 
  except sqlite3.OperationalError as e:
    print('Error: ', e)
    print('Rolling back database')
    conn.rollback()
  finally:
    if db_connected:
      conn.close() 
      print('Closing database')

if __name__ == '__main__':
  main()
