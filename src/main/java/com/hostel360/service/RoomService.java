
package com.hostel360.service;

import com.hostel360.entity.Room;
import com.hostel360.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Add a new room
    public Room addRoom(Room room) {
        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }

        if (room.getCapacity() <= 0) {
            throw new RuntimeException("Capacity must be greater than zero");
        }

        if (room.getOccupied() < 0 ||
            room.getOccupied() > room.getCapacity()) {
            throw new RuntimeException("Invalid occupied count");
        }

        if (room.getMonthlyFee() < 0) {
            throw new RuntimeException("Monthly fee cannot be negative");
        }

        if (room.getOccupied() == room.getCapacity()) {
            room.setStatus("FULL");
        } else {
            room.setStatus("AVAILABLE");
        }

        return roomRepository.save(room);
    }

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Get a room by ID
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Room not found: " + id));
    }

    // Update a room
    public Room updateRoom(Long id, Room updatedRoom) {
        Room existingRoom = getRoomById(id);

        if (!existingRoom.getRoomNumber().equals(updatedRoom.getRoomNumber())
                && roomRepository.existsByRoomNumber(updatedRoom.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }

        if (updatedRoom.getCapacity() <= 0 ||
            updatedRoom.getOccupied() < 0 ||
            updatedRoom.getOccupied() > updatedRoom.getCapacity() ||
            updatedRoom.getMonthlyFee() < 0) {
            throw new RuntimeException("Invalid room details");
        }

        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        existingRoom.setOccupied(updatedRoom.getOccupied());
        existingRoom.setMonthlyFee(updatedRoom.getMonthlyFee());

        existingRoom.setStatus(
            updatedRoom.getOccupied() == updatedRoom.getCapacity()
                ? "FULL" : "AVAILABLE"
        );

        return roomRepository.save(existingRoom);
    }

    // Delete a room
    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        roomRepository.delete(room);
    }
}
