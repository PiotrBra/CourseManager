package CourseManagerProject.CourseManager.controller;

import CourseManagerProject.CourseManager.dto.LoginDTO;
import CourseManagerProject.CourseManager.dto.UserRegistrationDTO;
import CourseManagerProject.CourseManager.model.User;
import CourseManagerProject.CourseManager.service.UserService;
import CourseManagerProject.CourseManager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Kontroler odpowiedzialny za operacje uwierzytelniania użytkowników.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Rejestruje nowego użytkownika.
     *
     * @param dto Obiekt DTO zawierający dane użytkownika.
     * @return Odpowiedź HTTP z informacją o powodzeniu rejestracji.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDTO dto) {
        Optional<User> existingUser = userService.getUserByEmail(dto.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Użytkownik z podanym adresem email już istnieje.");
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        User newUser = User.builder()
                .firstname(dto.getFirstname())
                .surname(dto.getSurname())
                .age(dto.getAge())
                .email(dto.getEmail())
                .password(hashedPassword)
                .isOrganizer(dto.getIsOrganizer())
                .build();
        userService.saveUser(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Użytkownik został pomyślnie zarejestrowany.");
    }

    /**
     * Obsługuje żądanie logowania użytkownika.
     *
     * @param loginDTO obiekt DTO zawierający email i hasło użytkownika
     * @return odpowiedź HTTP wskazująca na powodzenie lub niepowodzenie logowania
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Optional<User> userOpt = userService.getUserByEmail(loginDTO.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean matches = passwordEncoder.matches(loginDTO.getPassword(), user.getPassword());
            if (matches) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getId());
                return ResponseEntity.ok(Map.of(
                        "message", "Zalogowano pomyślnie!",
                        "token", token,
                        "userId", user.getId(),
                        "firstname", user.getFirstname(),
                        "surname", user.getSurname(),
                        "email", user.getEmail()
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Błędny email lub hasło.");
    }


}
