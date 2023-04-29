import { HotelPrice } from "../../entities/HotelPrice";

// export const findHotelPricesWithClosestDate = (hotelPrices: HotelPrice[], from: Date, to: Date) => {
//     let closestObject = null;
//     let closestDistance = Number.MAX_VALUE;
//     for (const hotelPrice of hotelPrices) {
//       const hotelPriceFromDate = new Date(hotelPrice.from!);
//       const hotelPriceToDate = new Date(hotelPrice.to!);
//       const distance = Math.min(Math.abs(from.getTime() - hotelPriceFromDate.getTime()), Math.abs(to.getTime() - hotelPriceToDate.getTime()));
//       if (distance < closestDistance) {
//         closestObject = hotelPrice;
//         closestDistance = distance;
//       }
//     }
//     return closestObject;
// }

// export const findHotelPricesWithClosestDate = (hotelPrices: HotelPrice[], fromDate: Date, toDate: Date) => {
//     if (hotelPrices.length === 0) {
//         return null;
//       }
    
//       let closestHotelPrice = hotelPrices[0];
//       let closestDistance = Math.min(
//         Math.abs(hotelPrices[0].from?.getTime()! - fromDate.getTime()),
//         Math.abs(hotelPrices[0].to?.getTime()!! - toDate.getTime())
//       );
    
//       for (let i = 1; i < hotelPrices.length; i++) {
//         const hotelPrice = hotelPrices[i];
//         const hotelPriceFromDate = hotelPrice.from!;
//         const hotelPriceToDate = hotelPrice.to!;
//         const distance = Math.min(Math.abs(fromDate.getTime() - hotelPriceFromDate.getTime()), Math.abs(toDate.getTime() - hotelPriceToDate.getTime()));
//         if (distance < closestDistance) {
//           closestHotelPrice = hotelPrice;
//           closestDistance = distance;
//         }
//       }
//       return closestHotelPrice;
// }

export const findHotelPricesWithClosestDate = (hotelPrices: HotelPrice[], fromDate: Date, toDate: Date) => {
    if (hotelPrices.length === 0) {
      return null;
    }
  
    let closestHotelPrice = hotelPrices[0];
    let closestDistance = Number.MAX_VALUE;
  
    for (let i = 0; i < hotelPrices.length; i++) {
      const hotelPrice = hotelPrices[i];
      const distance = Math.min(
        Math.abs(fromDate.getTime() - hotelPrice.from!.getTime()),
        Math.abs(toDate.getTime() - hotelPrice.to!.getTime())
      );
      if (distance < closestDistance) {
        closestHotelPrice = hotelPrice;
        closestDistance = distance;
      }
    }
  
    return closestHotelPrice;
  };

