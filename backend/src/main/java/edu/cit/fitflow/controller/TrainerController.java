package edu.cit.fitflow.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/trainer")
@PreAuthorize("hasRole('TRAINER')") // Restrict access to TRAINER role
public class TrainerController {

}
