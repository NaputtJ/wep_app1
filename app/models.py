from app import db


class Assessments(db.Model):
    """assessments table model"""
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    module_code = db.Column(db.String(20), nullable=False)
    deadline = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.Text, nullable=False)
    status = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Assessments id={self.id}>"

    def serialize(self):
        """serialize row into json compatible object"""
        return {
            "id": self.id,
            "title": self.title,
            "module_code": self.module_code,
            "deadline": self.deadline,
            "desc": self.desc,
            "status": True if self.status else False,
        }
