package com.hostel360.service;

import com.hostel360.entity.Notice;
import com.hostel360.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository repository;

    public NoticeService(NoticeRepository repository) {
        this.repository = repository;
    }

    public Notice addNotice(Notice notice) {
        if (notice.getTitle() == null || notice.getTitle().isBlank()
                || notice.getMessage() == null || notice.getMessage().isBlank()) {
            throw new IllegalArgumentException("Title and message are required");
        }

        notice.setId(null);
        notice.setTitle(notice.getTitle().trim());
        notice.setMessage(notice.getMessage().trim());

        return repository.save(notice);
    }

    public List<Notice> getAllNotices() {
        return repository.findAll(
            org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC,
                "createdAt"
            )
        );
    }

    public Notice getNoticeById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notice not found"));
    }

    public Notice updateNotice(Long id, Notice updated) {
        Notice existing = getNoticeById(id);

        if (updated.getTitle() == null || updated.getTitle().isBlank()
                || updated.getMessage() == null || updated.getMessage().isBlank()) {
            throw new IllegalArgumentException("Title and message are required");
        }

        existing.setTitle(updated.getTitle().trim());
        existing.setMessage(updated.getMessage().trim());
        existing.setPostedBy(updated.getPostedBy());

        return repository.save(existing);
    }

    public void deleteNotice(Long id) {
        repository.delete(getNoticeById(id));
    }
}