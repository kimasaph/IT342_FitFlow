package edu.cit.fitflow.service;

import edu.cit.fitflow.entity.UserEntity;
import edu.cit.fitflow.repository.UserRepository;
import edu.cit.fitflow.entity.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService {

  @Autowired
  private UserRepository urepo;

  @Value("${app.upload.dir}")
  private String uploadDir;

  public UserService() {
		super();
	}

  public UserEntity findByEmail(String email) {
		return urepo.findByEmail(email);
	}

  //find by ID
	public UserEntity findById(int userId) {
		return urepo.findById(userId).get();
	}

  //Read of CRUD
	public List<UserEntity> getAllUsers(){
		return urepo.findAll();
	}

  // Create a user with role validation
	public UserEntity createUser(UserEntity user) {
		if (user.getAge() == null) {
			user.setAge(0); // Default age value
		}
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
}