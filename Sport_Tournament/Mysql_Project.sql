CREATE DATABASE if not exists sport1;
USE sport1;

-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS Belong;
DROP TABLE IF EXISTS Play;
DROP TABLE IF EXISTS Matchs;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS Toornament;
DROP TABLE IF EXISTS Player;

-- Table Player (sans auto-incrément car player_id est un VARCHAR)
CREATE TABLE Player(
   player_id INT AUTO_INCREMENT,
   player_last_name VARCHAR(50) NOT NULL,
   player_first_name VARCHAR(50) NOT NULL,
   player_mail VARCHAR(50) NOT NULL,
   player_age INT NOT NULL,
   player_phone_number INT NOT NULL,
   PRIMARY KEY(player_id),
   UNIQUE(player_mail),
   UNIQUE(player_phone_number)
);

-- Table Toornament avec un auto-increment sur toornament_id
CREATE TABLE Toornament(
   toornament_id INT AUTO_INCREMENT,
   toornament_mail VARCHAR(50) NOT NULL unique ,
   toornament_name VARCHAR(50) NOT NULL,
   toornament_location VARCHAR(50) NOT NULL,
   toornament_start_date DATE NOT NULL,
   toornament_end_date DATE NOT NULL,
   PRIMARY KEY(toornament_id)
);

-- Table Team avec un auto-increment sur team_id
CREATE TABLE Team(
   team_id INT AUTO_INCREMENT,
   team_name VARCHAR(50) NOT NULL,
   team_number INT NOT NULL,
   team_creation_date DATE NOT NULL,
   team_location VARCHAR(50) NOT NULL,
   team_coach VARCHAR(50) NOT NULL,
   team_captain INT NOT NULL,
   PRIMARY KEY(team_id),
   UNIQUE(team_captain),
   UNIQUE(team_name),
   FOREIGN KEY(team_captain) REFERENCES Player(player_id)
);

-- Table Matchs avec un auto-increment sur matchs_id
CREATE TABLE Matchs(
   matchs_id INT AUTO_INCREMENT,
   toornament_id INT NOT NULL,
   matchs_date DATE NOT NULL,
   matchs_score1 VARCHAR(50) DEFAULT '/',
   matchs_score2 VARCHAR(50) DEFAULT '/',
   team1_id INT NOT NULL,
   team2_id INT NOT NULL,
   PRIMARY KEY(matchs_id),
   FOREIGN KEY(toornament_id) REFERENCES Toornament(toornament_id),
   FOREIGN KEY(team1_id) REFERENCES Team(team_id),
   FOREIGN KEY(team2_id) REFERENCES Team(team_id)
);

-- Table Belong (liens entre joueurs et équipes)
CREATE TABLE Belong(
   team_id INT,
   player_id INT,
   PRIMARY KEY(team_id, player_id),
   FOREIGN KEY(team_id) REFERENCES Team(team_id),
   FOREIGN KEY(player_id) REFERENCES Player(player_id)
);

-- Table Play (liens entre équipes et tournois)
CREATE TABLE Play(
   team_id INT,
   toornament_id INT,
   PRIMARY KEY(team_id, toornament_id),
   FOREIGN KEY(team_id) REFERENCES Team(team_id),
   FOREIGN KEY(toornament_id) REFERENCES Toornament(toornament_id)
);


-- Insertion de 10 joueurs dans la table Player
INSERT INTO Player (player_last_name, player_first_name, player_mail, player_age, player_phone_number)
VALUES 
('Doe', 'John', 'john.doe@example.com', 28, 1234567890),
('Smith', 'Jane', 'jane.smith@example.com', 24, 1234567891),
('Brown', 'Charlie', 'charlie.brown@example.com', 30, 1234567892),
('Taylor', 'Emma', 'emma.taylor@example.com', 26, 1234567893),
('Johnson', 'Oliver', 'oliver.johnson@example.com', 29, 1234567894),
('Williams', 'Sophia', 'sophia.williams@example.com', 27, 1234567895),
('Jones', 'Liam', 'liam.jones@example.com', 25, 1234567896),
('Garcia', 'Ava', 'ava.garcia@example.com', 31, 1234567897),
('Miller', 'Isabella', 'isabella.miller@example.com', 23, 1234567898),
('Davis', 'Mason', 'mason.davis@example.com', 32, 1234567899);

-- Insertion de 10 équipes dans la table Team
INSERT INTO Team (team_id, team_name, team_number, team_creation_date, team_location, team_coach, team_captain)
VALUES 
(1, 'Lions', 11, '2020-06-01', 'Paris', 'Coach A', 1),
(2, 'Tigers', 11, '2021-07-10', 'Berlin', 'Coach B', 2),
(3, 'Bears', 11, '2019-05-15', 'London', 'Coach C', 3),
(4, 'Wolves', 11, '2022-09-01', 'New York', 'Coach D', 4),
(5, 'Eagles', 11, '2020-08-25', 'Tokyo', 'Coach E', 5),
(6, 'Panthers', 11, '2021-11-12', 'Madrid', 'Coach F', 6),
(7, 'Sharks', 11, '2021-05-30', 'Sydney', 'Coach G', 7),
(8, 'Hawks', 11, '2022-03-22', 'Rome', 'Coach H', 8),
(9, 'Dragons', 11, '2018-10-19', 'Beijing', 'Coach I', 9),
(10, 'Cobras', 11, '2020-12-05', 'Dubai', 'Coach J', 10);

-- Insertion de 10 tournois dans la table Toornament
INSERT INTO Toornament (toornament_id,toornament_mail, toornament_name, toornament_location, toornament_start_date, toornament_end_date)
VALUES 
(1, "toornament1@mail.com",'Summer Championship', 'Paris', '2024-06-01', '2024-06-05'),
(2,"toornament2@mail.com" ,'Winter Cup', 'Berlin', '2024-12-01', '2024-12-10'),
(3, "toornament3@mail.com",'Spring Clash', 'London', '2024-03-15', '2024-03-20'),
(4, "toornament4@mail.com",'Autumn Invitational', 'New York', '2024-09-10', '2024-09-15'),
(5,"toornament5@mail.com" ,'Global Tournament', 'Tokyo', '2024-08-05', '2024-08-10'),
(6,"toornament6@mail.com" ,'World Cup', 'Madrid', '2024-11-15', '2024-11-20'),
(7,"toornament7@mail.com" ,'Champions League', 'Sydney', '2024-05-12', '2024-05-18'),
(8, "toornament8@mail.com",'Intercontinental Cup', 'Rome', '2024-04-22', '2024-04-27'),
(9,"toornament9@mail.com" ,'Dragon’s Challenge', 'Beijing', '2024-10-01', '2024-10-06'),
(10,"toornament10@mail.com" ,'Desert Duel', 'Dubai', '2024-07-20', '2024-07-25');

-- Insertion des matchs avec équipes originales
INSERT INTO Matchs (matchs_date,toornament_id, matchs_score1, matchs_score2, team1_id, team2_id)
VALUES 
('2024-06-01', 1, "3", "1", 1, 2),  -- Lions vs Tigers dans Summer Championship
('2024-06-01', 1, "1", "3", 2, 1),  -- Tigers vs Lions dans Summer Championship (inverse)
('2024-06-02', 1, "2", "2", 3, 4),  -- Bears vs Wolves dans Summer Championship
('2024-06-02', 1, "2", "2", 4, 3),  -- Wolves vs Bears dans Summer Championship (inverse)
('2024-12-01', 2, "1", "0", 5, 1),  -- Eagles vs Lions dans Winter Cup
('2024-12-01', 2, "0", "1", 1, 5),  -- Lions vs Eagles dans Winter Cup (inverse)
('2024-12-05', 2, "4", "2", 2, 3),  -- Tigers vs Bears dans Winter Cup
('2024-12-05', 2, "2", "4", 3, 2),  -- Bears vs Tigers dans Winter Cup (inverse)
('2024-03-15', 3, "2", "3", 4, 5),  -- Wolves vs Eagles dans Spring Clash
('2024-03-15', 3, "3", "2", 5, 4),  -- Eagles vs Wolves dans Spring Clash (inverse)
('2024-09-10', 4, "0", "2", 6, 7),  -- Panthers vs Sharks dans Autumn Invitational
('2024-09-10', 4, "2", "0", 7, 6),  -- Sharks vs Panthers dans Autumn Invitational (inverse)
('2024-08-05', 5, "3", "3", 8, 9),  -- Hawks vs Dragons dans Global Tournament
('2024-08-05', 5, "3", "3", 9, 8);  -- Dragons vs Hawks dans Global Tournament (inverse)

-- Insertion des matchs à venir
INSERT INTO Matchs (matchs_date,toornament_id, team1_id, team2_id)
VALUES 
('2024-11-15', 6, 10, 1), -- Cobras vs Lions dans World Cup
('2024-11-15', 6, 1, 10), -- Lions vs Cobras dans World Cup (inverse)
('2024-10-01', 9, 5, 9),  -- Eagles vs Dragons dans Dragon’s Challenge
('2024-10-01', 9, 9, 5),  -- Dragons vs Eagles dans Dragon’s Challenge (inverse)
('2024-07-20', 10, 7, 3), -- Sharks vs Bears dans Desert Duel
('2024-07-20', 10, 3, 7); -- Bears vs Sharks dans Desert Duel (inverse)

-- Insertion des appartenances des joueurs aux équipes
INSERT INTO Belong (team_id, player_id)
VALUES 
(1, 1),  -- John Doe dans Lions
(2, 2),  -- Jane Smith dans Tigers
(3, 3),  -- Charlie Brown dans Bears
(4, 4),  -- Emma Taylor dans Wolves
(5, 5),  -- Oliver Johnson dans Eagles
(6, 6),  -- Sophia Williams dans Panthers
(7, 7),  -- Liam Jones dans Sharks
(8, 8),  -- Ava Garcia dans Hawks
(9, 9),  -- Isabella Miller dans Dragons
(10, 10);  -- Mason Davis dans Cobras

-- Insertion des équipes dans les tournois
INSERT INTO Play (team_id, toornament_id)
VALUES 
(1, 1),  -- Lions jouent dans Summer Championship
(2, 1),  -- Tigers jouent dans Summer Championship
(3, 1),  -- Bears jouent dans Summer Championship
(4, 2),  -- Wolves jouent dans Winter Cup
(5, 2),  -- Eagles jouent dans Winter Cup
(6, 4),  -- Panthers jouent dans Autumn Invitational
(7, 4),  -- Sharks jouent dans Autumn Invitational
(8, 5),  -- Hawks jouent dans Global Tournament
(9, 9),  -- Dragons jouent dans Dragon’s Challenge
(10, 6);  -- Cobras jouent dans World Cup

Drop table if exists USERS;
CREATE TABLE USERS (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL UNIQUE,
  user_pass VARCHAR(255) NOT NULL,  -- Mot de passe haché
  user_role ENUM('USER', 'ADMIN') DEFAULT 'USER',  -- Rôle de l'utilisateur
  user_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO USERS 
(user_name, user_pass, user_role, user_created)
VALUES 
('joeuser', SHA2(CONCAT('1234', 'joeuser'), 224), 'USER', NOW());

INSERT INTO USERS 
(user_name, user_pass, user_role, user_created)
VALUES 
('admin', sha2(concat('12345', 'admin'), 224), 'ADMIN', NOW());



