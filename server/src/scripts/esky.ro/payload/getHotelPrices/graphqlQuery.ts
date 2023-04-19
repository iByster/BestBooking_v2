export const graphqlQuery = `
query Variants($variantParams: HotelVariantInput!) {
    hotelVariants(params: $variantParams) {
      context {
        partnerCode
        contextsApplied
      }
      hotel {
        metaCode
      }
      variants {
        id
        qualifiedCode
        bookingLocator
        providerCode
        rooms {
          id
          name
          description
          bedType
          photos {
            medium {
              src
              width
              height
            }
            thumbnail {
              src
              width
              height
            }
          }
          facilities
          notifications
          hasFreeCancellation
          hasRoomInformation
          freeCancellationDate(format: "YYYY-MM-DD")
        }
        price {
          amount
          currency
          format
        }
        facilities {
          type
          description
        }
        paymentType
      }
      variantsGroupedByFacilities {
        type
        values {
          variantIds
          facilityTranslatedName
          facilityValue
        }
      }
      optionsGroupedByFacilities {
        translatedName
        type
        values {
          facilityValue
          facilityTranslatedName
          optionIds
        }
      }
      groupedVariants {
        rooms {
          id
          availableRooms
          name
          bedType
          displayName
          descriptions {
            text
            additionalText
            icon
            appearance
          }
          photos {
            medium {
              width
              height
              src
            }
            thumbnail {
              width
              height
              src
            }
          }
          amenities {
            title {
              icon
              title
            }
            amenitiesGroups {
              title {
                icon
                title
              }
              amenities
            }
          }
        }
        options {
          id
          qualifiedCode
          providerCode
          bookingLocator
          hotelPricingLocator
          hasFreeCancellation
          freeCancellationDate(format: "YYYY-MM-DD")
          mealPlan {
            type
            name
          }
          paymentType {
            type
            name
          }
          isPricePerPax
          stayLength
          price {
            currency
            amount
          }
        }
      }
    }
  }
`