CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `flag` bit(2) NOT NULL,
  `virtual_account_number` varchar(11) NOT NULL,
  `film_id` int NOT NULL,
  `screening_id` int NOT NULL,
  `showtime` timestamp NOT NULL,
  `seat_id` int NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
)