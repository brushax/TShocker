use keyring::{Entry, Error as KeyringError};
use serde::{Deserialize, Serialize};

const KEYRING_SERVICE: &str = "com.brushax.tshocker";
const KEYRING_ACCOUNT: &str = "credentials";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
struct StoredCredentials {
    server_url: String,
    username: String,
    password: String,
    token: Option<String>,
}

fn credentials_entry() -> Result<Entry, String> {
    Entry::new(KEYRING_SERVICE, KEYRING_ACCOUNT)
        .map_err(|error| format!("Failed to initialize secure storage: {error}"))
}

fn serialize_credentials(credentials: &StoredCredentials) -> Result<String, String> {
    serde_json::to_string(credentials)
        .map_err(|error| format!("Failed to serialize secure credentials: {error}"))
}

fn deserialize_credentials(serialized: &str) -> Result<StoredCredentials, String> {
    serde_json::from_str(serialized)
        .map_err(|error| format!("Failed to deserialize secure credentials: {error}"))
}

fn keyring_error(action: &str, error: KeyringError) -> String {
    format!("Failed to {action} secure credentials: {error}")
}

#[tauri::command]
fn load_credentials() -> Result<Option<StoredCredentials>, String> {
    let entry = credentials_entry()?;

    match entry.get_password() {
        Ok(serialized) => deserialize_credentials(&serialized).map(Some),
        Err(KeyringError::NoEntry) => Ok(None),
        Err(error) => Err(keyring_error("load", error)),
    }
}

#[tauri::command]
fn save_credentials(credentials: StoredCredentials) -> Result<(), String> {
    let entry = credentials_entry()?;
    let serialized = serialize_credentials(&credentials)?;

    entry
        .set_password(&serialized)
        .map_err(|error| keyring_error("save", error))
}

#[tauri::command]
fn clear_credentials() -> Result<(), String> {
    let entry = credentials_entry()?;

    match entry.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(error) => Err(keyring_error("clear", error)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            load_credentials,
            save_credentials,
            clear_credentials
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::{deserialize_credentials, serialize_credentials, StoredCredentials};

    #[test]
    fn credentials_round_trip_through_json() {
        let credentials = StoredCredentials {
            server_url: "https://demo.example.com".into(),
            username: "owner".into(),
            password: "secret".into(),
            token: Some("cached-token".into()),
        };

        let serialized = serialize_credentials(&credentials).expect("should serialize");
        let restored = deserialize_credentials(&serialized).expect("should deserialize");

        assert_eq!(restored, credentials);
    }

    #[test]
    fn invalid_json_is_rejected() {
        assert!(deserialize_credentials("not-json").is_err());
    }
}
