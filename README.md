# Tiny Towns

A React web app implementing the board game Tiny Towns using React and Zustand for state management.

---

## Prerequisites

- **Docker Desktop** installed on your machine.  
  Download from https://www.docker.com/products/docker-desktop and follow the instructions for your OS.

## Installation & Setup

1. **Download Docker Desktop**  
   Ensure Docker is running before proceeding.

2. **Install the app**  
   - Download the ZIP file containing this project.  
   - Uncompress (unzip) the file to a folder of your choice.

3. **Create a Firebase project**  
   - Go to the [Firebase Console](https://console.firebase.google.com).  
   - Click **Add project**, enter a project name, and follow the prompts.  
   - After creation, open **Project settings** (gear icon → Project settings).

4. **Retrieve Firebase credentials**  
   - **firebaseConfig.json**:  
     - In the **General** tab under **Your apps**, click **Add app** (select the Web icon).  
     - Register a new app, then copy the `firebaseConfig` snippet and save it as `firebaseConfig.json`.  
   - **serviceAccountKey.json**:  
     - In the **Service accounts** tab, click **Generate new private key**.  
     - Download the JSON file and rename it to `serviceAccountKey.json`.

5. **Place credentials**  
   Move both `firebaseConfig.json` and `serviceAccountKey.json` into the root directory of the unzipped project (where `docker-compose.yml` is located).

6. **Run the app with Docker**  
   - Open a terminal in the project root directory.  
   - Execute:
     ```bash
     docker-compose up
     ```
   - Docker will build and start the Tiny Towns app.  
   - Once finished, visit `http://localhost:3000` in your browser (or the port defined in `docker-compose.yml`).

## Contributing

- Open issues for bugs or feature requests.  
- Submit pull requests with clear descriptions of changes.

## License

This project is licensed under the MIT License.  
