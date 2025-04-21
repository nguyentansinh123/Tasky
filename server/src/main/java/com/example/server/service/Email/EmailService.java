package com.example.server.service.Email;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Async
    public void send(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setFrom("nsinh2281@gmail.com");
            message.setSubject("Confirm Your Email");
            String messageBody = """
                    
                    
                    Thank you for registration. Please confirm your email.
                    
                    http://localhost:9193/api/v1/auth/register/confirmToken?token=%s
                    
                    """.formatted(token);

            message.setText(messageBody);
            mailSender.send(message);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }
}
