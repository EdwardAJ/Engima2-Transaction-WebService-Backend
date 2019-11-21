cd /home/ubuntu/ws-transaksi
git stash
git checkout feature-CICD
git pull origin feature-CICD
echo 'Deleting screen...'
screen -X -S wstransaction-database quit
screen -X -S wstransaction-node quit
echo 'Creating .env'
cp ENV.SAMPLE .env
echo 'Entering screen...'
screen -d -m -S wstransaction-database sudo docker-compose up
screen -d -m -S wstransaction-node node index.js