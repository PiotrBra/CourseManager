package CourseManagerProject.CourseManager.service;

import CourseManagerProject.CourseManager.dto.UserRegistrationDTO;
import CourseManagerProject.CourseManager.dto.UserUpdateDTO;
import CourseManagerProject.CourseManager.model.User;
import CourseManagerProject.CourseManager.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Klasa serwisu odpowiedzialna za operacje na użytkownikach w systemie.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    /**
     * Pobiera listę wszystkich użytkowników z bazy danych.
     *
     * @return lista użytkowników
     */
    public List<User> getAll() {
        return userRepository.findAll();
    }

    /**
     * Pobiera użytkownika na podstawie identyfikatora.
     *
     * @param id identyfikator użytkownika
     * @return opcjonalny obiekt użytkownika, jeśli istnieje
     */
    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    /**
     * Pobiera użytkownika na podstawie adresu email.
     *
     * @param email adres email użytkownika
     * @return opcjonalny obiekt użytkownika, jeśli istnieje
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Aktualizuje dane użytkownika.
     *
     * @param id identyfikator użytkownika
     * @param userUpdateDTO obiekt DTO zawierający dane do aktualizacji
     * @return zaktualizowany użytkownik
     * @throws IllegalArgumentException jeśli użytkownik o podanym identyfikatorze nie istnieje
     */
    @Transactional
    public User updateUser(Integer id, UserUpdateDTO userUpdateDTO) {
        return userRepository.findById(id).map(existingUser -> {
            if (userUpdateDTO.getFirstname() != null) {
                existingUser.setFirstname(userUpdateDTO.getFirstname());
            }
            if (userUpdateDTO.getSurname() != null) {
                existingUser.setSurname(userUpdateDTO.getSurname());
            }
            if (userUpdateDTO.getAge() != null) {
                existingUser.setAge(userUpdateDTO.getAge());
            }
            if (userUpdateDTO.getEmail() != null) {
                existingUser.setEmail(userUpdateDTO.getEmail());
            }
            if (userUpdateDTO.getPassword() != null) {
                existingUser.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
            }
            if (userUpdateDTO.getIsOrganizer() != null) {
                existingUser.setIsOrganizer(userUpdateDTO.getIsOrganizer());
            }
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    /**
     * Usuwa użytkownika na podstawie identyfikatora.
     *
     * @param id identyfikator użytkownika
     * @throws IllegalArgumentException jeśli użytkownik o podanym identyfikatorze nie istnieje
     */
    @Transactional
    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User does not exist");
        }
        userRepository.deleteById(id);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }
}
