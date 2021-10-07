"""
Converts dates from m/d/yyyy to yyyy-mm-dd format
in database. Changes a specified field in a
given database.
"""
import sqlite3
import sys
import re


dateRe = re.compile(r'^(\d{1,2})\/(\d{1,2})/(\d{4})$')
def convertDate(s):
    "Converts str from m/d/yyyy to yyyy-mm-dd"
    s = s.strip()
    match = dateRe.match(s)
    if match:
        month = match.group(1).zfill(2)
        day = match.group(2).zfill(2)
        year = match.group(3)
        return f'{year}-{month}-{day}'

    else:
        return ""

class DbManager:
    def __init__(self, dbName):
        self.dbName = dbName

    def __enter__(self):
        self.connection = sqlite3.connect(self.dbName)
        return self.connection.cursor()

    def __exit__(self, type, value, traceback):
        self.connection.commit()
        self.connection.close()

def main():
    if len(sys.argv) != 2:
        print('Usage: python3 dateConverter dbName')
        return

    _, dbName = sys.argv

    with DbManager(dbName) as cursor:
        cursor.execute('SELECT id, date_entered FROM history_record')
        records = cursor.fetchall()
        for id, date_entered in records:
            convertedDate = convertDate(date_entered)
            if convertedDate:
                cursor.execute('''
                    UPDATE history_record SET date_entered = ?
                    WHERE id = ?
                ''', (convertedDate, id))

        print('Converted date entered fields')

if __name__ == "__main__":
    main()
