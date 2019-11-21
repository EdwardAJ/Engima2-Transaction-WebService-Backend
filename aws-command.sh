cd /home/ubuntu/ws-transaksi
git stash
git checkout feature-CICD
git pull origin feature-CICD
echo 'Deleting database screen...'
screen -X -S wstransaction-database quit
echo 'Deleting node screen...'
screen -X -S wstransaction-node quit
echo 'Creating .env'
cp ENV.SAMPLE .env
echo 'Entering database screen...'
screen -d -m -S wstransaction-database sudo docker-compose up
echo 'Entering node screen...'
screen -d -m -S wstransaction-node node index.js