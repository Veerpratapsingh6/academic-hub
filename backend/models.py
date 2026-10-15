from sqlalchemy import Column, Integer, String

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    password = Column(String, nullable=False)

    department = Column(String, nullable=True)

    year = Column(String, nullable=True)




class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    subject = Column(String, nullable=False)

    description = Column(String, nullable=False)

    file_path = Column(String, nullable=False)

    user_id = Column(Integer, nullable=False)



class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    user_id = Column(Integer, nullable=False)
    document_id = Column(Integer, nullable=False)



class SavedDocument(Base):
    __tablename__ = "saved_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    document_id = Column(Integer, nullable=False)


