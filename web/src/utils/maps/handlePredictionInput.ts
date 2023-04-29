export const handlePredictionInput = (prediction: any) => {
    const { types, terms, description } = prediction;

    const destination = {
        hotelName: '',
        country: '',
        area: '',
        region: '',
        locationName: '',
      }

    if (types.includes('lodging')) {
        destination.hotelName = terms.shift().value;
    }

    if (terms.length > 2) {
        destination.country = terms.pop().value;
        destination.locationName = terms.pop().value;
    } else {
        const descriptionParts = description.split(',');

        destination.country = descriptionParts.pop().trim();
        destination.locationName = descriptionParts.pop().trim();
    }

    const termValues = terms.map((term: any) => term.value);

    return { ...destination, terms: termValues, description };
}