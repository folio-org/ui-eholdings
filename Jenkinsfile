pipeline {
    agent { docker { image 'node:9' } }
    stages {
        stage('Checkout') {
            checkout scm
            steps {
                sh 'yarn install'
            }
        }
    }
}
