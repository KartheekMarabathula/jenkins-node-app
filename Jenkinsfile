pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u node'
        }
    }
options {
        timeout(time: 10, unit: 'MINUTES')
    }
 environment {
        IMAGE_NAME = "karthiq18/jenkins-node-app"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
stages{
    stage('Install Dependencies'){
        steps{
            sh 'npm install'
        }
    }
    stage('Run Tests'){
         steps{
            sh 'npm test'
        }
    }
    stage('Build Docker Image'){
         steps{
            sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
        }
    }
    stage('Login to Docker Hub'){
         steps{
            withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                sh "echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin"
            }
        }
    }
    stage('Push to Docker Hub'){
         steps{
            sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
        }
    }
    stage('Deploy to EC2'){
        steps {
        withCredentials([
            string(credentialsId: 'ec2-host', variable: 'EC2_HOST'),
            sshUserPrivateKey(
                credentialsId: 'ec2-ssh-key',
                keyFileVariable: 'SSH_KEY',
                usernameVariable: 'EC2_USER'
            )
        ]) {
            sh """
            ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_USER@$EC2_HOST << EOF

            docker pull ${IMAGE_NAME}:${IMAGE_TAG}

            docker stop node-app || true
            docker rm node-app || true

            docker run -d \
              --name node-app \
              -p 80:3000 \
              ${IMAGE_NAME}:${IMAGE_TAG}

            EOF
            """
        }
    }
}
}

}

