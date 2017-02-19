package users;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import javax.persistence.*;
import org.eclipse.persistence.exceptions.DatabaseException;
import org.eclipse.persistence.exceptions.PersistenceUnitLoadingException;
import org.mindrot.jbcrypt.BCrypt;

@Entity
@Table
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String username;
    private String email;
    private String hashword;
    private String sessionToken;

    @Temporal(TemporalType.TIMESTAMP)
    private Date sessionTokenExpireDate;

    @Transient
    private static EntityManagerFactory entityManagerFactory;

    @Transient
    private EntityManager entityManager;

    public static void initializeClass(EntityManagerFactory entityManagerFactory) {
        User.entityManagerFactory = entityManagerFactory;
    }

    public User(){
      entityManager = entityManagerFactory.createEntityManager();
    }

    public void create(){
        EntityTransaction et = entityManager.getTransaction();
        et.begin();
        entityManager.persist(this);
        et.commit();
    }

    public void update(){
        EntityTransaction et = entityManager.getTransaction();
        et.begin();
        entityManager.merge(this);
        et.commit();
    }

    public void delete(){
      User.delete(id);
    }

    public static void delete(int id){
      EntityManager entityManager = entityManagerFactory.createEntityManager();
      EntityTransaction et = entityManager.getTransaction();
      et.begin();
      // User object must be deleted by same manager that finds it
      User user = entityManager.find(User.class, id);
      entityManager.remove(user);
      et.commit();
      entityManager.close();
    }

    public void setPassword(String password) {
      // copied from http://www.mindrot.org/projects/jBCrypt/
      hashword = BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public boolean checkPassword(String candidate){
      // copied from http://www.mindrot.org/projects/jBCrypt/
      return BCrypt.checkpw(candidate, hashword);
    }

    public void close(){
        entityManager.close();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSessionToken() {
      return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
      this.sessionToken = sessionToken;
    }

    public Date getSessionTokenExpireDate() {
      return sessionTokenExpireDate;
    }

    public void setSessionTokenExpireDate(Date sessionTokenExpireDate) {
      this.sessionTokenExpireDate = sessionTokenExpireDate;
    }

  public static void main(String[] args) {
    // run this to create a user
    System.setProperty("javax.xml.accessExternalDTD", "all");

    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));

    try{
      EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("Eclipselink_JPA");
      User.initializeClass(entityManagerFactory);
      User user = new User();

      for(int i=0; i<20; i++){
        // try to clear screen
        System.out.println();
      }

      System.out.print("Enter username: ");
      user.setUsername(bufferedReader.readLine());
      System.out.print("Enter email: ");
      user.setEmail(bufferedReader.readLine());
      System.out.print("Enter password: ");
      user.setPassword(bufferedReader.readLine());

      user.create();
      System.out.println("User creation successful!");
    }
    catch (PersistenceUnitLoadingException e){
      System.out.println("Could not load persistence unit");
    }
    catch (DatabaseException e){
      System.out.println("Database connection failed");
    }
    catch (IOException e){
      System.out.println("Unable to create user");
    }
  }
}
