"""
Migration script to add priority and due_date columns to tasks table
Run this after updating the model to add new columns
"""
from sqlalchemy import text
from app.core.database import engine

def migrate():
    try:
        with engine.connect() as conn:
            # Add priority column if it doesn't exist
            try:
                conn.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'"))
                print("Added priority column")
            except Exception as e:
                if "Duplicate column name" in str(e):
                    print("Priority column already exists")
                else:
                    raise
            
            # Add due_date column if it doesn't exist
            try:
                conn.execute(text("ALTER TABLE tasks ADD COLUMN due_date DATE"))
                print("Added due_date column")
            except Exception as e:
                if "Duplicate column name" in str(e):
                    print("due_date column already exists")
                else:
                    raise
            
            conn.commit()
            print("\nMigration completed successfully!")
            
    except Exception as e:
        print(f"Migration failed: {e}")
        raise

if __name__ == "__main__":
    migrate()
