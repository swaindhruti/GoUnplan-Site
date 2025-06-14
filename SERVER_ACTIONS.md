# Server Actions Documentation

## User Actions

### Profile Management

- `getUserProfile` - Fetches a user's profile data and booking statistics
- `updateUserProfile` - Updates a user's personal information (name, email, bio, etc.)
- `applyForHost` - Marks a user as having applied for host status

### Booking Management

- `bookTravelPlan` - Creates a new booking for a travel plan with pricing calculation
- `getUserBookings` - Retrieves all bookings for a specific user
- `getBookingsByStatus` - Fetches user's bookings filtered by a specific status (PENDING/CONFIRMED/etc.)
- `getBookingDetails` - Gets detailed information about a specific booking
- `cancelBooking` - Cancels a booking and calculates appropriate refund

## Admin Actions

### User Management

- `getAllUsers` - Gets a list of all users
- `deleteUser` - Removes a user account
- `updateUserRole` - Changes a user's role (USER/HOST/ADMIN)

### Host Management

- `getAllHosts` - Gets a list of all hosts
- `getHostApplications` - Gets all pending host applications
- `approveHostApplication` - Approves a host application
- `rejectHostApplication` - Rejects a host application

### Buisness Management

- `getTotalRevenue` - Calculates total confirmed and refund revenue by the platform
- `refundBooking` - Update the DB for bookings after a refund is completed by Uplan Admin

## Host Actions

### Host Management

- `getHostDetails` - Fetches details about a specific host
- `updateHostProfile` - Updates a host's profile information (name, bio, etc.)

### Travel Plan Management

- `createTravelPlan` - Creates a new travel plan for a host
- `getHostTravelPlansByStatus` - Retrieves travel plans created by a host filtered by status (ACTIVE/INACTIVE)
