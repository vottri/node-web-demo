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
                script {

                    sh '''
                        CURRENT=$(grep '"version"' package.json | awk -F '"' '{print $4}')

                        major=$(echo "$CURRENT" | cut -d. -f1)
                        minor=$(echo "$CURRENT" | cut -d. -f2)
                        patch=$(echo "$CURRENT" | cut -d. -f3)

                        NEW_VERSION="$major.$minor.$((patch+1))"

                        echo "Updating version: $CURRENT → $NEW_VERSION"

                        sed -i "s/\\"version\\": \\"[^\"]*\\"/\\"version\\": \\"$NEW_VERSION\\"/" package.json

                        echo "$NEW_VERSION" > .version_tmp
                    '''

                    // Lấy version để dùng ở stage sau
                    env.NEW_VERSION = readFile('.version_tmp').trim()
                }
            }
        }

        stage('Commit & Push Back to GitHub') {
            steps {
                withCredentials([string(credentialsId: "${GIT_CREDENTIAL_ID}", variable: "TOKEN")]) {
                    sh """
                        git config user.email "${GIT_USER_EMAIL}"
                        git config user.name "${GIT_USER_NAME}"

                        git add package.json

                        # Chỉ commit nếu có thay đổi
                        git diff --cached --quiet || git commit -m "CI: Auto bump version to ${NEW_VERSION}"

                        git push https://${TOKEN}:x-oauth-basic@github.com/<your-username>/<your-repo>.git HEAD:main
                    """
                }
            }
        }
    }

    post {
        always {
            echo "CI Pipeline completed!"
            echo "New version pushed: ${env.NEW_VERSION}"
        }
    }
}
