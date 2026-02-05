import sqlite3
import os

# Make sure we use the correct path
DB_PATH = os.path.join(os.path.dirname(__file__), "gym.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Add 'status' column if it doesn't already exist
try:
    cursor.execute("ALTER TABLE attendance ADD COLUMN status TEXT DEFAULT 'present'")
    print("Column 'status' added successfully!")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("Column 'status' already exists!")
    else:
        raise

conn.commit()
conn.close()
