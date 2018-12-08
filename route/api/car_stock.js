// Prerequisite: Connection to appropriate instance has been established
// Case 1: Insert a CarStock row onto current db
// Case 2: 
// 1. Insert a CarModel row onto current db
// 2. Replicate that row onto others (manually looping through all instances)
// 3. Insert a CarStock row, referencing new CarModel row onto current db only

// MongoDB does not support partial replication (cannot choose to replicate certain tables, but all)
// Use Mongo driver to perform write actions myself

// Two-phase commit transaction
// Concurrency management
// Prevent deadlock
