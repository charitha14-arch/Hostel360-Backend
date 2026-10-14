package com.hostel360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.hostel360.entity.LostAndFound;
import com.hostel360.service.LostAndFoundService;

@RestController
@RequestMapping("/api/lost-found")
@CrossOrigin(origins = "http://localhost:5173")
public class LostAndFoundController {

    private final LostAndFoundService lostAndFoundService;

    public LostAndFoundController(LostAndFoundService lostAndFoundService) {
        this.lostAndFoundService = lostAndFoundService;
    }

    @GetMapping
    public List<LostAndFound> getAllItems() {
        return lostAndFoundService.getAllItems();
    }

    @GetMapping("/{id}")
    public LostAndFound getItemById(@PathVariable Long id) {
        return lostAndFoundService.getItemById(id);
    }

    @PostMapping
    public LostAndFound addItem(@RequestBody LostAndFound item) {
        return lostAndFoundService.addItem(item);
    }

    @PutMapping("/{id}")
    public LostAndFound updateItem(
            @PathVariable Long id,
            @RequestBody LostAndFound item) {
        return lostAndFoundService.updateItem(id, item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        lostAndFoundService.deleteItem(id);
    }
}