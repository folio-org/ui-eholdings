pipeline {
  agent { 
    docker { 
      image 'node:9' 
    } 
  }
  stages {
    stage('Checkout') {
      steps {
        sh 'yarn install'
      }
    }
    stage('Verify') {
      parallel {
        stage('Lint JS') {
          steps {
            bat "yarn eslint --max-warnings=0 --format junit --output-file ./artifacts/eslint/eslint.xml"
          }
        }
        stage('Lint CSS') {
          steps {
            sh "yarn --silent stylelint --custom-formatter './node_modules/stylelint-junit-formatter' > ./artifacts/stylelint/stylelint.xml"
          }
        }
      }
    }
  }
}
