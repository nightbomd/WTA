import Icon from "./icon";
import Button from "./btn";
import { deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";



export default function Settings({ onBack, onSignOut, user, onAccountDeleted }) {
    const handleDeleteAccount = async () => {
        const user = auth.currentUser;

        if (!user) return;

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete your account?"
        );

        if (!confirmed) return;

        try {
            await deleteDoc(doc(db, "users", user.uid));
            await deleteUser(user);

            localStorage.removeItem("inquiryData");
            onAccountDeleted?.();
        } catch (error) {
            console.error("Account deletion failed:", error);

            if (error.code === "auth/requires-recent-login") {
                alert("Please sign out, sign back in, and try again.");
            } else {
                alert("Account deletion failed. Please try again.");
            }
        }
    };
    return (
        <main className="profile-page">
            <button
                type="button"
                className="profile-back-button"
                onClick={onBack}
            >
                <Icon name="arrow-left" size={18} />
                Back
            </button>
            <header className="profile-header">
                <p className="card-eyebrow">Your account</p>
                <h1>Settings</h1>

            </header>

            <section
                className="profile-data-card settings-card"
                aria-label="Account settings"
            >
                <div className="settings-section">
                    <div className="settings-section__copy">
                        <h2>Account</h2>
                        <p>Signed in as {user?.email || "Guest"}</p>
                    </div>
                    {user && (
                        <Button
                            onClick={onSignOut}
                            className="settings-action"
                            text="Sign Out"
                        />
                    )}
                </div>

                <div className="settings-section settings-section--danger">
                    <div className="settings-section__copy">
                        <h2>Danger zone</h2>
                        <p>Delete your account and its saved workout data.</p>
                    </div>
                    <Button
                        onClick={handleDeleteAccount}
                        text="Delete Account"
                        bg="#1c1c1c"
                        color="#ef4444"
                        border="1px solid #4a2626"
                        className="settings-action"
                    />
                </div>
            </section>
        </main>
    );
}
