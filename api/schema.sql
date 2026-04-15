DROP DATABASE IF EXISTS nam_nam_v2;
CREATE DATABASE nam_nam_v2;
USE nam_nam_v2;

CREATE TABLE Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    icono VARCHAR(255), 
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Usuario (Con soporte para Profile.jsx y roles para AdminDashboard.jsx)
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_mostrar VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) UNIQUE,
    url_foto TEXT,
    password_hash VARCHAR(255) NULL,
    biografia TEXT,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla Receta (Con relación a Categoría y soporte para HeroCarousel.jsx)
CREATE TABLE Receta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_creador INT NOT NULL,
    id_categoria INT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    tiempo_prep_minutos INT NOT NULL,
    tiempo_coccion_minutos INT NOT NULL,
    porciones INT NOT NULL,
    dificultad ENUM('facil', 'medio', 'dificil') DEFAULT 'facil',
    url_imagen TEXT,
    es_destacada BOOLEAN DEFAULT FALSE, -- Indicador para el Carrusel
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_creador) REFERENCES Usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 4. Tabla Ingrediente
CREATE TABLE Ingrediente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_receta INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL, 
    unidad VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_receta) REFERENCES Receta(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Tabla Paso
CREATE TABLE Paso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_receta INT NOT NULL,
    numero_paso INT NOT NULL,
    instruccion TEXT NOT NULL,
    duracion_segundos INT,
    FOREIGN KEY (id_receta) REFERENCES Receta(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Tabla Favorito (Para el hook useFavorites.js)
CREATE TABLE Favorito (
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    fecha_guardado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_receta), -- Evita duplicados
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_receta) REFERENCES Receta(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Tabla Valoracion (Estrellas para la receta)
CREATE TABLE Valoracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5), 
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_receta) REFERENCES Receta(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. Tabla Comentario (Para CommentSection.jsx y subcomentarios/hilos)
CREATE TABLE Comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    id_respuesta_a INT, -- Permite que un comentario sea respuesta a otro
    texto TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_receta) REFERENCES Receta(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_respuesta_a) REFERENCES Comentario(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. Tabla Configuracion_Usuario (Para Settings.jsx)
CREATE TABLE Configuracion_Usuario (
    id_usuario INT PRIMARY KEY,
    recibir_emails BOOLEAN DEFAULT TRUE,
    sistema_medidas ENUM('metrico', 'imperial') DEFAULT 'metrico',
    tema_oscuro BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 10. Tabla Configuracion_Global (Para SettingsPanel.jsx del Admin)
CREATE TABLE Configuracion_Global (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion VARCHAR(255)
);