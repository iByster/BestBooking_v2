import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts";
import {
  AGODA_COM,
  BOOKING_COM,
  DIRECT_BOOKING_RO,
  ESKY_RO,
} from "../../constants";
import { destructureRooms, parseDateToISO } from "../../utils/parse/parseUtils";

interface IProps {
  hotelPricesGraph: any;
}

const HotelPricesScatterChart: React.FC<IProps> = ({ hotelPricesGraph }) => {
  const CustomChartToolTip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hotelPrice = payload[0].payload;

      const { pricePerNight, description, from, to, rooms } = hotelPrice;

      const roomsParse = JSON.parse(rooms);
      const { adults, children } = destructureRooms(roomsParse);

      return (
        <div className="bg-gray-300 p-3 rounded-md">
          <p className="font-extrabold">{description}</p>
          <p>
            Price per night:{" "}
            <span className="font-extrabold">{pricePerNight.toFixed(2)}</span>
          </p>
          <p>From: {parseDateToISO(new Date(from))}</p>
          <p>To: {parseDateToISO(new Date(to))}</p>
          <p>
            Guests: {adults} adults, {children} children, {roomsParse.length}{" "}
            rooms
          </p>
        </div>
      );
    }

    return null;
  };

  const getChartColorBySiteName = (site: string) => {
    if (site.includes(BOOKING_COM)) {
      return "#065d9e";
    }

    if (site.includes(ESKY_RO)) {
      return "#149DAC";
    }

    if (site.includes(DIRECT_BOOKING_RO)) {
      return "#82ca9d";
    }

    if (site.includes(AGODA_COM)) {
      return "#b21717";
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        width={500}
        height={400}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="from" allowDuplicatedCategory={false} />
        <YAxis dataKey="pricePerNight" />
        <ChartTooltip content={<CustomChartToolTip />} />
        <Legend />
        {hotelPricesGraph &&
          hotelPricesGraph.map((hotelPriceGraph: any) => {
            if (hotelPriceGraph.value.length > 0) {
              return (
                <Scatter
                  // line
                  data={hotelPriceGraph.value}
                  type="monotone"
                  dataKey="pricePerNight"
                  key={
                    hotelPriceGraph.field
                      .replace(/^https?:\/\//i, "")
                      .split("/")[0]
                  }
                  name={
                    hotelPriceGraph.field
                      .replace(/^https?:\/\//i, "")
                      .split("/")[0]
                  }
                  // connectNulls
                  fill={getChartColorBySiteName(hotelPriceGraph.field)}
                  stroke={getChartColorBySiteName(hotelPriceGraph.field)}
                />
              );
            }
          })}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default HotelPricesScatterChart;
