export const CONFIRM_OR_CANCEL_BOOKING_MUTATION = `

mutation ConfirmOrCancelBooking(
$input: ConfirmOrCancelBookingInput!
){

confirmOrCancelBooking(input:$input){

message

}

}

`;