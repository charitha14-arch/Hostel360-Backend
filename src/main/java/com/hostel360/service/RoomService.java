package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.Room;
import com.hostel360.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Get room by ID
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    // Add room
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    // Update room
    public Room updateRoom(Long id, Room room) {

        Room existingRoom = roomRepository.findById(id).orElse(null);

        if (existingRoom != null) {
            existingRoom.setRoomNumber(room.getRoomNumber());
            existingRoom.setBlock(room.getBlock());
            existingRoom.setCapacity(room.getCapacity());
            existingRoom.setOccupied(room.getOccupied());
            existingRoom.setStatus(room.getStatus());

            return roomRepository.save(existingRoom);
        }

        return null;
    }

    // Delete room
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}