import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Hotel } from './entities/Hotel';
import { HotelPrice } from './entities/HotelPrice';
import { Location } from './entities/Location';
import path from 'path';
dotenv.config();

const DropPoint = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // logging: true,
  synchronize: true,
  entities: [
    Hotel,
    HotelPrice,
    Location,
  ],
  migrations: [path.join(__dirname, './migrations/*')]
});

export default DropPoint;