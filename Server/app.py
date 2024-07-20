from flask import Flask, request, jsonify, session, abort, redirect, render_template, url_for
from flask_bcrypt import Bcrypt 
from flask_cors import CORS, cross_origin
from authlib.integrations.flask_client import OAuth
import json
from urllib.parse import quote_plus, urlencode
from models import db, User

app = Flask(__name__)

appConf = {
    "OAUTH2_CLIENT_ID": "todo",
    "OAUTH2_CLIENT_SECRET": "dJBlsIp2JIMzBKUN9egNEasuWcHrCkjW",
    "OAUTH2_ISSUER": "http://localhost:8080/realms/myrealm",
    "FLASK_SECRET": "cairocoders-ednalan",
    "FLASK_PORT": 5000
}

app.config['SECRET_KEY'] = 'cairocoders-ednalan'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True

bcrypt = Bcrypt(app) 
CORS(app, supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all()

oauth = OAuth(app)
oauth.register(
    "myApp",
    client_id=appConf.get("OAUTH2_CLIENT_ID"),
    client_secret=appConf.get("OAUTH2_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'{appConf.get("OAUTH2_ISSUER")}/.well-known/openid-configuration',
)

@app.route("/")
def hello_world():
    return render_template("../Client/index.html", session=session.get("user"), pretty=json.dumps(session.get("user"), indent=4))

@app.route("/callback")
def callback():
    token = oauth.myApp.authorize_access_token()
    session["user"] = token
    return redirect(url_for("hello_world"))

@app.route("/login")
def login():
    print("Login route accessed")
    if "user" in session:
        print("User already logged in, aborting")
        abort(404)
    print("Redirecting to OAuth")
    return oauth.myApp.authorize_redirect(redirect_uri=url_for("callback", _external=True))


@app.route("/signup", methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/loggedout")
def loggedOut():
    # check if session already present
    if "user" in session:
        abort(404)
    # return redirect(url_for("hello_world"))
    return "You are logged out..."

@app.route("/logout", methods=["POST"])
def logout_user():
    # Clear the local Flask session
    session.clear()
    print("Session cleared")

    # Redirect to OAuth provider logout URL
    if "user" in session:
        id_token = session.get("user", {}).get("id_token")
        if id_token:
            logout_url = (
                f'{appConf.get("OAUTH2_ISSUER")}/protocol/openid-connect/logout?'
                f'{urlencode({"post_logout_redirect_uri": url_for("loggedOut", _external=True), "id_token_hint": id_token})}'
            )
            print(f"Redirecting to OAuth logout URL: {logout_url}")
            return redirect(logout_url)

    return jsonify({"message": "Logged out successfully"})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
