-- phpMyAdmin SQL Dump

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Música'),
(2, 'Deportes'),
(3, 'Teatro'),
(4, 'Exposiciones'),
(5, 'Festivales'),
(6, 'Fiestas y Celebraciones'),
(7, 'Gastronomía'),
(8, 'Conferencias y Charlas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genders`
--

CREATE TABLE `genders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `gender_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `genders`
--

INSERT INTO `genders` (`id`, `gender_name`) VALUES
(1, 'Femenino'),
(2, 'Masculino'),
(3, 'Otro'),
(4, 'Prefiero no decirlo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `type_users`
--

CREATE TABLE `type_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `type_users`
--

INSERT INTO `type_users` (`id`, `name`) VALUES
(1, 'administrador'),
(2, 'organizador'),
(3, 'consumidor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `types_payment_methods`
--

CREATE TABLE `types_payment_methods` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `types_payment_methods`
--

INSERT INTO `types_payment_methods` (`id`, `name`) VALUES
(1, 'Tarjeta de crédito'),
(2, 'Tarjeta de débito'),
(3, 'PayPal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `type_venue`
--

CREATE TABLE `type_venue` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `type_venue`
--

INSERT INTO `type_venue` (`id`, `name`) VALUES
(1, 'Presencial'),
(2, 'Virtual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_users_id` int(11) NOT NULL,
  `gender_id` int(10) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `user_name` varchar(64) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gender_id` (`gender_id`),
  KEY `type_users_id` (`type_users_id`),
  CONSTRAINT `fk_users_genders` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_users_type_users` FOREIGN KEY (`type_users_id`) REFERENCES `type_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `type_users_id`, `gender_id`, `full_name`, `user_name`, `dni`, `email`, `birthdate`, `phone`, `photo`, `password`, `created_at`, `deleted_at`) VALUES
(1, 1, 2, 'Yoshikage Kira', 'kirayoshikage', '12323456', 'kira@gmail.com', '1980-01-30', '1122334455', NULL, 'mer_pass', '2024-10-27 10:00:00', NULL),
(2, 2, 2, 'Joseph Joestar', 'josephjoestar', '12374738', 'ningendurayo@gmail.com', '1986-09-05', '1147589123', NULL, 'ker_pass', '2024-10-27 10:00:00', NULL),
(3, 3, 2, 'Dio Brando', 'diobrando', '12374739', 'zawarudo@gmail.com', '1986-09-05', '1147589124', NULL, 'konodioda', '2024-10-27 10:00:00', NULL),
(4, 3, 2, 'Funny Valentine', 'D4C', '43214455', 'doyjaan@gmail.com', '1970-06-05', '1476920811', NULL, 'lovetrain', '2024-10-28 12:00:00', NULL),
(5, 3, 2, 'Diavolo', 'boss', '12276731', 'kingcrimson@gmail.com', '1989-11-09', '1682378483', NULL, 'yu_pass', '2024-11-03 15:30:00', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payments_methods`
--

CREATE TABLE `payments_methods` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `types_payment_methods_id` int(10) NOT NULL,
  `user_id` int(11) NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `number` varchar(20) NOT NULL,
  `expiration` date NOT NULL,
  `CVV` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `types_payment_methods_id` (`types_payment_methods_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_pm_types` FOREIGN KEY (`types_payment_methods_id`) REFERENCES `types_payment_methods` (`id`),
  CONSTRAINT `fk_pm_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `payments_methods`
--

INSERT INTO `payments_methods` (`id`, `types_payment_methods_id`, `user_id`, `responsible`, `number`, `expiration`, `CVV`) VALUES
(1, 1, 3, 'Diavolo', '1234567890123456', '2028-12-31', '123'),
(2, 2, 4, 'd4c', '9876543210987654', '2027-06-30', '456'),
(3, 3, 5, 'boss', '1111222233334444', '2026-03-31', '789');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venues`
--

CREATE TABLE `venues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_venue_id` int(4) NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `province` varchar(255) NOT NULL,
  `locality` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `beginning` date NOT NULL,
  `ending` date NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1,
  `suitable_for_all_audiences` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `type_venue_id` (`type_venue_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `fk_venues_type_venue` FOREIGN KEY (`type_venue_id`) REFERENCES `type_venue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_venues_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_venues_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venues`
--

INSERT INTO `venues` (`id`, `type_venue_id`, `category_id`, `user_id`, `province`, `locality`, `address`, `description`, `beginning`, `ending`, `image`, `name`, `suitable_for_all_audiences`, `created_at`, `deleted_at`) VALUES
(1, 1, 3, 2, 'Buenos Aires', 'CABA', 'Av. Corrientes 1234', 'Teatro con capacidad para 500 personas.', '2026-08-01', '2026-08-31', NULL, 'Teatro Corrientes', 1, '2026-07-29 12:00:00', NULL),
(2, 2, 8, 2, 'Buenos Aires', 'CABA', 'Av. Santa Fe 5678', 'Conferencia virtual sobre tecnología.', '2026-09-15', '2026-09-15', NULL, 'Tech Conference Online', 1, '2026-07-29 12:00:00', NULL),
(3, 1, 1, 2, 'Buenos Aires', 'CABA', 'Av. Callao 91011', 'Concierto de rock en vivo.', '2026-10-05', '2026-10-05', NULL, 'Rock Night Live', 0, '2026-07-29 12:00:00', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `owner_authorization`
--

CREATE TABLE `owner_authorization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `owner_dni` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `residential_address` varchar(255) NOT NULL,
  `document` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `fk_owner_auth_venue` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `owner_authorization`
--

INSERT INTO `owner_authorization` (`id`, `venue_id`, `owner_name`, `owner_dni`, `phone`, `residential_address`, `document`) VALUES
(1, 1, 'Joseph Joestar', '12374738', '1147589123', 'Av. Siempreviva 742, CABA', 'autorizacion_teatro.pdf'),
(2, 3, 'Joseph Joestar', '12374738', '1147589123', 'Av. Siempreviva 742, CABA', 'autorizacion_rock.pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `security_measures`
--

CREATE TABLE `security_measures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `amount_security_personnel` int(11) NOT NULL,
  `amount_extinguishers` int(11) NOT NULL,
  `emergency_exits` tinyint(1) NOT NULL,
  `amount_emergency_exits` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `fk_sec_measures_venue` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `security_measures`
--

INSERT INTO `security_measures` (`id`, `venue_id`, `description`, `amount_security_personnel`, `amount_extinguishers`, `emergency_exits`, `amount_emergency_exits`) VALUES
(1, 1, 'Seguridad básica', 2, 3, 1, 2),
(2, 2, 'Seguridad avanzada', 4, 5, 1, 3),
(3, 3, 'Seguridad mínima', 1, 2, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_favorites`
--

CREATE TABLE `user_favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `fk_uf_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_uf_venues` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_favorites`
--

INSERT INTO `user_favorites` (`id`, `venue_id`, `user_id`) VALUES
(1, 1, 3),
(2, 3, 3),
(3, 2, 4),
(4, 1, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venue_assistance`
--

CREATE TABLE `venue_assistance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `fk_va_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_va_venues` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venue_assistance`
--

INSERT INTO `venue_assistance` (`id`, `venue_id`, `user_id`) VALUES
(1, 1, 3),
(2, 2, 4),
(3, 3, 5);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;