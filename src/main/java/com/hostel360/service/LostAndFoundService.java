package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.LostAndFound;
import com.hostel360.repository.LostAndFoundRepository;

@Service
public class LostAndFoundService {

    private final LostAndFoundRepository lostAndFoundRepository;

    public LostAndFoundService(LostAndFoundRepository lostAndFoundRepository) {
        this.lostAndFoundRepository = lostAndFoundRepository;
    }

    public List<LostAndFound> getAllItems() {
        return lostAndFoundRepository.findAll();
    }

    public LostAndFound getItemById(Long id) {
        return lostAndFoundRepository.findById(id).orElse(null);
    }

    public LostAndFound addItem(LostAndFound item) {
        return lostAndFoundRepository.save(item);
    }

    public LostAndFound updateItem(Long id, LostAndFound item) {

        LostAndFound existing =
                lostAndFoundRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setItemName(item.getItemName());
            existing.setDescription(item.getDescription());
            existing.setLocation(item.getLocation());
            existing.setStatus(item.getStatus());

            return lostAndFoundRepository.save(existing);
        }

        return null;
    }

    public void deleteItem(Long id) {
        lostAndFoundRepository.deleteById(id);
    }
}