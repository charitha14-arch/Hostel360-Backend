package com.hostel360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hostel360.entity.Announcement;
import com.hostel360.repository.AnnouncementRepository;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id).orElse(null);
    }

    public Announcement addAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(Long id, Announcement announcement) {

        Announcement existing =
                announcementRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setTitle(announcement.getTitle());
            existing.setMessage(announcement.getMessage());
            existing.setDate(announcement.getDate());

            return announcementRepository.save(existing);
        }

        return null;
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}