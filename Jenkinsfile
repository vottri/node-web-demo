pipeline {
    agent any

    environment {
        GIT_CREDENTIAL_ID = "github_pat"
        GIT_USER_EMAIL = "thangtrivo1991@gmail.com"
        GIT_USER_NAME = "vottri"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git credentialsId: "${GIT_CREDENTIAL_ID}",
                    url: "https://github.com/vottri/node-web-demo.git",
                    branch: "main"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Auto Update Version') {
            steps {
                sh """
                CURRENT=\$(grep '"version"' package.json | awk -F '"' '{print \$4}')
                IFS='.' read -r major minor patch <<< "\$CURRENT"
                NEW_VERSION="\$major.\$minor.\$((patch+1))"

                echo "Updating version: \$CURRENT → \$NEW_VERSION"

                sed -i "s/\\\"version\\\": \\\"[^\"]*\\\"/\\\"version\\\": \\\"\$NEW_VERSION\\\"/" package.json
                """
            }
        }

        stage('Commit & Push Back to GitHub') {
            steps {
                withCredentials([string(credentialsId: "${GIT_CREDENTIAL_ID}", variable: "TOKEN")]) {
                    sh """
                    git config user.email "${GIT_USER_EMAIL}"
                    git config user.name "${GIT_USER_NAME}"

                    git add .
                    git commit -m "CI: Auto bump version"
                    
                    git push https://${TOKEN}:x-oauth-basic@github.com/vottri/node-web-demo.git HEAD:main
                    """
                }
            }
        }
    }

    post {
        always {
            echo "CI Pipeline completed!"
        }
    }
}
