package edu.cit.fitflow.service;

import edu.cit.fitflow.entity.Role;
import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService {

  @Autowired
  private UserRepository urepo;

  private static final Logger logger = LoggerFactory.getLogger(UserService.class);

  public UserService() {
		super();
	}

  public UserEntity findByEmail(String email) {
    UserEntity user = urepo.findByEmail(email);
    if (user == null) {
        logger.warn("No user found with email: {}", email);
    }
    return user;
  }

  //find by ID
	public UserEntity findById(int userId) {
		return urepo.findById(userId).get();
	}

  //Read of CRUD
  public List<UserEntity> getAllUsers() {
    logger.info("Fetching all users with role USER");
    return urepo.findAll().stream()
        .filter(user -> user.getRole() == Role.USER)
        .toList();
  }

  //Create of User
	public UserEntity createUser(UserEntity user) {
		return urepo.save(user);
	}

  //Update of User
  @SuppressWarnings("finally")
  public UserEntity updateUser(int userId, UserEntity newUserDetails) {
    UserEntity user = new UserEntity();

    try {
      user = urepo.findById(userId).get();

      user.setUsername(newUserDetails.getUsername());
      user.setEmail(newUserDetails.getEmail());
      user.setPassword(newUserDetails.getPassword());
      user.setCreated_at(newUserDetails.getCreated_at());
      user.setFirstName(newUserDetails.getFirstName());
      user.setLastName(newUserDetails.getLastName());
      user.setPhoneNumber(newUserDetails.getPhoneNumber());
      user.setGender(newUserDetails.getGender());
      user.setHeight(newUserDetails.getHeight());
      user.setWeight(newUserDetails.getWeight());
      user.setAge(newUserDetails.getAge());
      user.setBodyGoal(newUserDetails.getBodyGoal());
    } catch (NoSuchElementException e) {
      System.out.println("User not found");
    } finally {
      return urepo.save(user);
    }
  }

  //Delete of User
  public String deleteUser(int userId) {
    String msg = "";

    if(urepo.findById(userId).isPresent()) {
      urepo.deleteById(userId);
      msg = "User deleted successfully";
    } else {
      msg = "User not found";
    }
    return msg;
  }

  public List<UserEntity> getAllTrainers() {
    logger.info("Fetching all trainers");
    return urepo.findAll().stream()
        .filter(user -> user.getRole() == Role.TRAINER)
        .toList();
  }

  public UserEntity createTrainer(UserEntity trainer) {
    logger.info("Creating trainer with email: {}", trainer.getEmail());
    trainer.setRole(Role.TRAINER);
    return urepo.save(trainer);
  }

  public UserEntity updateTrainer(int trainerId, UserEntity updatedTrainerDetails) {
    logger.info("Updating trainer with ID: {}", trainerId);
    return updateUser(trainerId, updatedTrainerDetails); // Reuse existing update logic
  }

  public String deleteTrainer(int trainerId) {
    logger.info("Deleting trainer with ID: {}", trainerId);
    return deleteUser(trainerId); // Reuse existing delete logic
  }
}