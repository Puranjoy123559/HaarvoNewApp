// What every availability endpoint returns.
//   available = true  -> nobody is using this value, the user can use it
//   available = false -> already taken; message explains why for the UI
export class AvailabilityResponseDto {
  available!: boolean;
  message?: string;
}
