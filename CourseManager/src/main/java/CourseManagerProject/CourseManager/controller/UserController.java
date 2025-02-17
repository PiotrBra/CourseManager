package CourseManagerProject.CourseManager.controller;

import CourseManagerProject.CourseManager.dto.UserRegistrationDTO;
import CourseManagerProject.CourseManager.dto.UserUpdateDTO;
import CourseManagerProject.CourseManager.model.User;
import CourseManagerProject.CourseManager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Kontroler odpowiedzialny za operacje na użytkownikach w systemie.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    /**
     * Pobiera listę wszystkich użytkowników.
     *
     * @return odpowiedź HTTP zawierająca listę użytkowników
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAll();
        return ResponseEntity.ok(users);
    }

    /**
     * Pobiera użytkownika na podstawie identyfikatora.
     *
     * @param id identyfikator użytkownika
     * @return odpowiedź HTTP zawierająca dane użytkownika lub informację o jego braku
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Pobiera użytkownika na podstawie adresu email.
     *
     * @param email adres email użytkownika
     * @return odpowiedź HTTP zawierająca dane użytkownika lub informację o jego braku
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    /**
     * Aktualizuje dane użytkownika.
     *
     * @param id identyfikator użytkownika
     * @param userUpdateDTO obiekt DTO zawierający dane do aktualizacji
     * @return odpowiedź HTTP zawierająca zaktualizowane dane użytkownika lub błąd, jeśli użytkownik nie istnieje
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody UserUpdateDTO userUpdateDTO) {
        try {
            User updatedUser = userService.updateUser(id, userUpdateDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Usuwa użytkownika na podstawie identyfikatora.
     *
     * @param id identyfikator użytkownika
     * @return odpowiedź HTTP informująca o powodzeniu lub błędzie operacji
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
