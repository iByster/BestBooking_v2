import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Hotel } from './entities/Hotel';
import { HotelPrice } from './entities/HotelPrice';
import { Location } from './entities/Location';
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
});

export default DropPoint;