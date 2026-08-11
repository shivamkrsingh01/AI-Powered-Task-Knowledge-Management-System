from app.core.database import SessionLocal, engine, Base
from app.models import User, Role, Task
from app.core.security import get_password_hash

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if roles already exist
        admin_role = db.query(Role).filter(Role.name == "Admin").first()
        user_role = db.query(Role).filter(Role.name == "User").first()
        
        if not admin_role:
            admin_role = Role(name="Admin")
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)
            print("Created Admin role")
        
        if not user_role:
            user_role = Role(name="User")
            db.add(user_role)
            db.commit()
            db.refresh(user_role)
            print("Created User role")
        
        # Check if admin user exists
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                name="Admin User",
                email="admin@example.com",
                password_hash=get_password_hash("admin123"),
                role_id=admin_role.id
            )
            db.add(admin_user)
            db.commit()
            print("Created admin user: admin@example.com / admin123")
        
        # Check if regular user exists
        regular_user = db.query(User).filter(User.email == "user@example.com").first()
        if not regular_user:
            regular_user = User(
                name="Regular User",
                email="user@example.com",
                password_hash=get_password_hash("user123"),
                role_id=user_role.id
            )
            db.add(regular_user)
            db.commit()
            print("Created regular user: user@example.com / user123")
        
        # Create sample tasks
        if db.query(Task).count() == 0:
            task1 = Task(
                title="Read employee policy",
                description="Review the employee policy document",
                status="pending",
                assigned_to=regular_user.id,
                created_by=admin_user.id
            )
            task2 = Task(
                title="Complete security training",
                description="Finish the annual security training module",
                status="pending",
                assigned_to=regular_user.id,
                created_by=admin_user.id
            )
            db.add(task1)
            db.add(task2)
            db.commit()
            print("Created sample tasks")
        
        print("\nDatabase initialization completed successfully!")
        print("\nDemo Credentials:")
        print("Admin: admin@example.com / admin123")
        print("User: user@example.com / user123")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
