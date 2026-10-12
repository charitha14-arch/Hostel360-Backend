package com.hostel360.controller;

import com.hostel360.entity.Notice;
import com.hostel360.service.NoticeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    private final NoticeService service;

    public NoticeController(NoticeService service) {
        this.service = service;
    }

    @PostMapping
    public Notice addNotice(@RequestBody Notice notice) {
        return service.addNotice(notice);
    }

    @GetMapping
    public List<Notice> getAllNotices() {
        return service.getAllNotices();
    }

    @GetMapping("/{id}")
    public Notice getNoticeById(@PathVariable Long id) {
        return service.getNoticeById(id);
    }

    @PutMapping("/{id}")
    public Notice updateNotice(
            @PathVariable Long id,
            @RequestBody Notice notice) {
        return service.updateNotice(id, notice);
    }

    @DeleteMapping("/{id}")
    public String deleteNotice(@PathVariable Long id) {
        service.deleteNotice(id);
        return "Notice deleted successfully";
    }
}